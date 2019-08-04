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
        $entityManager->persist($user);
        $entityManager->flush(); // save user

        $response = \App\Service\Request::sendRequest($user); // send POST request to http://test.vrgsoft.net/feedbacks

        $data = json_decode($response->getBody());
        if($response->getStatusCode() == 200) { //if response code = 200
            $em = $this->getDoctrine()->getManager();
            $row = $entityManager->getRepository(Users::class)->find($user->getId());
            $row->setFeedBackDataId($data->feedbackDataId); //update feedBackDataId
            $em->flush();
        } else {
            $logger->error('An error occurred: response of http://test.vrgsoft.net/feedbacks is '.$response->getStatusCode());
        }
        return new JsonResponse($data->feedbackDataId);
    }
}
