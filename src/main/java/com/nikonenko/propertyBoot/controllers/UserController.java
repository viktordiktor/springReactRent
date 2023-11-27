package com.nikonenko.propertyBoot.controllers;

import com.nikonenko.propertyBoot.utils.JwtUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin
@Tag(name="User Controller", description="Responsible for User profile")
public class UserController {
    private final JwtUtils jwtUtils;

    @GetMapping("/profile")
    @Operation(
            summary = "User Profile",
            description = "Allows to obtain data user profile"
    )
    public ResponseEntity<?> getUserProfile(@RequestHeader("Authorization")
                                                @Parameter(description = "Access token", required = true)
                                                String authorizationHeader){
        return ResponseEntity.ok(jwtUtils.extractUser(authorizationHeader.substring(7)));
    }

    @GetMapping("/role")
    @Operation(
            summary = "User Role",
            description = "Allows to obtain user role"
    )
    public ResponseEntity<?> getUserRole(@RequestHeader("Authorization")
                                            @Parameter(description = "Access token", required = true)
                                            String authorizationHeader){
        return ResponseEntity.ok(jwtUtils.extractUser(authorizationHeader.substring(7)).getRole());
    }
}
