package com.nikonenko.propertyBoot.controllers;

import com.nikonenko.propertyBoot.dto.AuthenticationRequest;
import com.nikonenko.propertyBoot.dto.RegisterRequest;
import com.nikonenko.propertyBoot.services.AuthenticationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin
@Tag(name="Authentication Controller", description="Responsible for authentication")
public class AuthenticationController {
    private final AuthenticationService service;

    @PostMapping("/register")
    @Operation(
            summary = "Register"
    )
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterRequest request,
            BindingResult bindingResult
    ) {
      if (bindingResult.hasErrors()) {
        return ResponseEntity.badRequest().body(bindingResult.getAllErrors());
      }

      try {
        return ResponseEntity.ok(service.register(request));
      } catch (IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
      }
    }

    @PostMapping("/authenticate")
    @Operation(
            summary = "Authentication"
    )
    public ResponseEntity<?> authenticate(
            @Valid @RequestBody AuthenticationRequest request,
            BindingResult bindingResult
    ) {
      if (bindingResult.hasErrors()) {
        return ResponseEntity.badRequest().body(bindingResult.getAllErrors());
      }

      return ResponseEntity.ok(service.authenticate(request));
    }

    @PostMapping("/refresh-token")
    @Operation(
            summary = "Refresh token",
            description = "Allows to refresh access-token by refresh-token"
    )
    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
      service.refreshToken(request, response);
    }
}
