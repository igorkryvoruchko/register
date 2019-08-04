<?php

namespace App\Controller;

use App\Entity\Users;
use http\Client\Response;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class RegisterController extends AbstractController
{
    /**
     * @Route("/", name="register")
     */
    public function index()
    {
        return $this->render('register/index.html.twig', [
            'controller_name' => 'RegisterController',
        ]);
    }

    /**
     * @Route("/save", name="save")
     */
    public function save(Request $request, LoggerInterface $logger)
    {
        $entityManager = $this->getDoctrine()->getManager();
        $user = new Users();
        $user->setName($request->get('name'));
        $user->setSecondName($request->get('second_name'));
        $user->setPhone($request->get('phone'));
        $user->setAddress($request->get('address'));
        $user->setComment($request->get('comment'));
        $user->setFeedBackDataId("");
        $entityManager->persist($user);
        $entityManager->flush();

        $client = new \GuzzleHttp\Client();
        $response = $client->request('POST', 'http://test.vrgsoft.net/feedbacks', array(
                'form_params' => array(
                    'client_id' => $user->getId(),
                    'address' => $request->get('address'),
                    'comment' => $request->get('comment')
                ),
                'headers' => [
                    'Content-Type' => 'application/x-www-form-urlencoded',
                ]
            )
        );
        $data = json_decode($response->getBody());
        if($response->getStatusCode() == 200) {
            $em = $this->getDoctrine()->getManager();
            $row = $entityManager->getRepository(Users::class)->find($user->getId());
            $row->setFeedBackDataId($data->feedbackDataId);
            $em->flush();
        } else {
            $logger->error('An error occurred: response of http://test.vrgsoft.net/feedbacks is '.$response->getStatusCode());
        }
        return new JsonResponse($data->feedbackDataId);
    }
}
