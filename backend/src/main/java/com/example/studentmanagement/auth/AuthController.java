package com.example.studentmanagement.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository repository;

    @Autowired
    private JwtUtil jwtUtil;

    private BCryptPasswordEncoder encoder =
            new BCryptPasswordEncoder();

    @PostMapping("/register")
    public String register(@RequestBody User user) {

        user.setPassword(
                encoder.encode(user.getPassword()));

        repository.save(user);

        return "User registered successfully";
    }

    @PostMapping("/login")
    public Map<String, String> login(
            @RequestBody User request) {

        User user = repository.findByUsername(
                request.getUsername())
                .orElseThrow();

        boolean valid = encoder.matches(
                request.getPassword(),
                user.getPassword());

        if (!valid) {
            throw new RuntimeException(
                    "Invalid password");
        }

        String token =
                jwtUtil.generateToken(
                        user.getUsername());

        return Map.of("token", token);
    }
}
