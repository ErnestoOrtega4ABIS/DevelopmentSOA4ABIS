package com.utd.ti.soa.esb_service.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;

import org.springframework.http.HttpHeaders;
import org.springframework.web.reactive.function.client.WebClient;

import com.utd.ti.soa.esb_service.model.Client;
import com.utd.ti.soa.esb_service.utils.Auth;

@RestController
@RequestMapping("/api/v1/esb")
public class ESBClientController {

    private final WebClient webClient = WebClient.create();
    private final Auth auth = new Auth();

    @GetMapping("/client")
    public ResponseEntity<String> getClients(@RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        System.out.println("Token recibido: " + token); 

        if (!auth.validateToken(token)) {
            return ResponseEntity.status(401).body("Token Invalido");
        }
        String response = webClient.get()
            .uri("http://localhost:3010/api/clients")
            .retrieve()
            .bodyToMono(String.class)
            .block();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/client/create")
    public ResponseEntity<String> createClient(@RequestBody Client client , @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        System.out.println("Request Body: " + client);
        System.out.println("Token recibido: " + token);

        if (!auth.validateToken(token)) {
            return ResponseEntity.status(401).body("Token Invalido");
        }

        String response = webClient.post()
                .uri("http://localhost:3010/api/clients/create")
                .bodyValue(client)
                .retrieve()
                .bodyToMono(String.class)
                .block();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/client/{id}")
    public ResponseEntity<String> updateClient(@PathVariable String id, @RequestBody Client client, @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        System.out.println("Request Body: " + client);
        System.out.println("Token recibido: " + token);
        if (!auth.validateToken(token)) {
            return ResponseEntity.status(401).body("Token Invalido");
        }
        String response = webClient.put()
                .uri("http://localhost:3010/api/clients/" + id)
                .bodyValue(client)
                .retrieve()
                .bodyToMono(String.class)
                .block();
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/client/delete/{id}")
    public ResponseEntity<String> deactivateClient(@PathVariable String id, @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        System.out.println("Token recibido: " + token);
        if (!auth.validateToken(token)) {
            return ResponseEntity.status(401).body("Token Invalido");
        }

        String response = webClient.patch()
                .uri("http://localhost:3010/api/clients/delete/" + id)
                .retrieve()
                .bodyToMono(String.class)
                .block();
        return ResponseEntity.ok(response);
    }

}
