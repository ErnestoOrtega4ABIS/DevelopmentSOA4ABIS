package com.utd.ti.soa.esb_service.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;

import com.utd.ti.soa.esb_service.model.User;
import com.utd.ti.soa.esb_service.utils.Auth;

@RestController
@RequestMapping("/api/v1/esb")
public class ESBUserController {

    private final WebClient webClient = WebClient.create();
    private final Auth auth = new Auth();

    @PostMapping("/user")
    public ResponseEntity<String> createUser(@RequestBody User user, @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        System.out.println("Request Body: " + user);
        System.out.println("Token recibido: " + token);

        if (!auth.validateToken(token)) {
            return ResponseEntity.status(401).body("Token Invalido");
        }

        String response = webClient.post()
                .uri("http://localhost:3011/api/users/create")
                .bodyValue(user)
                .retrieve()
                .bodyToMono(String.class)
                .block();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user")
    public ResponseEntity<String> getAllUsers(@RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        System.out.println("Token recibido: " + token); 

        if (!auth.validateToken(token)) {
            return ResponseEntity.status(401).body("Token Invalido");
        }
        String response = webClient.get()
            .uri("http://localhost:3011/api/users")
            .retrieve()
            .bodyToMono(String.class)
            .block();
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/user/{id}")
    public ResponseEntity<String> updateUser(@PathVariable String id, @RequestBody User user, @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        System.out.println("Request Body: " + user);
        System.out.println("Token recibido: " + token);

        if (!auth.validateToken(token)) {
            return ResponseEntity.status(401).body("Token Invalido");
        }

        String response = webClient.patch()
            .uri("http://localhost:3011/api/users/{id}", id)
            .bodyValue(user)
            .retrieve()
            .bodyToMono(String.class)
            .block();
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/user/delete/{id}")
    public ResponseEntity<String> deactivateUser(@PathVariable String id, @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        System.out.println("Token recibido: " + token);

        if (!auth.validateToken(token)) {
            return ResponseEntity.status(401).body("Token Invalido");
        }

        String response = webClient.patch()
            .uri("http://localhost:3011/api/users/delete/{id}", id)
            .retrieve()
            .bodyToMono(String.class)
            .block();

        return ResponseEntity.ok(response);
    }
}