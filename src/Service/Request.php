<?php


namespace App\Service;


class Request
{
    public function sendRequest($user)
    {
        $client = new \GuzzleHttp\Client();
        $response = $client->request('POST',
            'http://test.vrgsoft.net/feedbacks',
            array(
                'form_params' => array(
                    'client_id' => $user->getId(),
                    'address' => $user->getAddress(),
                    'comment' => $user->getComment()
                ),
                'headers' => [
                    'Content-Type' => 'application/x-www-form-urlencoded',
                ]
            )
        );

        return $response;
    }
}