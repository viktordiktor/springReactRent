package com.nikonenko.propertyBoot.controllers;

import com.nikonenko.propertyBoot.dto.AdminResponse;
import com.nikonenko.propertyBoot.models.Property;
import com.nikonenko.propertyBoot.models.User;
import com.nikonenko.propertyBoot.services.PropertyService;
import com.nikonenko.propertyBoot.services.UserService;
import com.nikonenko.propertyBoot.utils.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;
    private final PropertyService propertyService;

    @GetMapping
    public ResponseEntity<?> getAdminData(){
        return ResponseEntity.ok(userService.findAll());
    }

    @DeleteMapping("/deleteProperty/{propertyId}")
    public ResponseEntity<?> deletePropertyByAdmin(@PathVariable Integer propertyId){
        if(propertyService.findOne(propertyId).isEmpty()){
            return ResponseEntity.badRequest().body("Неверный id объявления");
        }
        Property deletedProperty = propertyService.findOne(propertyId).get();
        propertyService.hardDelete(deletedProperty);
        return ResponseEntity.ok(deletedProperty);
    }
}
