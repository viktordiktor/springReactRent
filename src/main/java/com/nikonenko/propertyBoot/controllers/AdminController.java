package com.nikonenko.propertyBoot.controllers;

import com.nikonenko.propertyBoot.models.Property;
import com.nikonenko.propertyBoot.services.PropertyService;
import com.nikonenko.propertyBoot.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin
@PreAuthorize("hasRole('ADMIN')")
@Tag(name="Admin Controller", description="Responsible for administrator capabilities")
public class AdminController {

    private final UserService userService;
    private final PropertyService propertyService;

    @GetMapping
    @Operation(
            summary = "Admin Panel",
            description = "Allows to obtain data about users, property ads"
    )
    public ResponseEntity<?> getAdminData(){
        return ResponseEntity.ok(userService.findAll());
    }

    @DeleteMapping("/deleteProperty/{propertyId}")
    @Operation(
            summary = "Hard delete",
            description = "Hard delete property ad"
    )
    public ResponseEntity<?> deletePropertyByAdmin(@PathVariable Integer propertyId){
        if(propertyService.findOne(propertyId).isEmpty()){
            return ResponseEntity.badRequest().body("Incorrect property ID");
        }
        Property deletedProperty = propertyService.findOne(propertyId).get();
        propertyService.hardDelete(deletedProperty);
        return ResponseEntity.ok(deletedProperty);
    }
}
