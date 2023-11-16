package com.nikonenko.propertyBoot.controllers;

import com.nikonenko.propertyBoot.models.Person;
import com.nikonenko.propertyBoot.models.User;
import com.nikonenko.propertyBoot.services.RegistrationService;
import com.nikonenko.propertyBoot.utils.UserRegistrationData;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final RegistrationService registrationService;

    @Autowired
    public AuthController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @PostMapping("/registry")
    public ResponseEntity<String> registerUser(@RequestBody UserRegistrationData userData) {
        try {
            User user = new User();
            user.setUsername(userData.getUsername());
            user.setPassword(userData.getPassword());
            user.setRole("ROLE_USER");

            Person person = new Person();
            person.setFullName(userData.getFullName());
            person.setPhone(userData.getPhone());

            user.setPerson(person);
            person.setUser(user);

            registrationService.register(user, person);

            // Возвращаем успешный ответ
            return ResponseEntity.ok("Регистрация успешна");
        } catch (Exception e) {
            // Возвращаем ошибку в случае возникновения исключения
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Ошибка при регистрации");
        }
    }
}
