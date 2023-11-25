package com.nikonenko.propertyBoot.controllers;

import com.nikonenko.propertyBoot.dto.PersonDTO;
import com.nikonenko.propertyBoot.models.Person;
import com.nikonenko.propertyBoot.services.PersonService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/person")
@RequiredArgsConstructor
@CrossOrigin
@Tag(name="Person Controller", description="Responsible for profile settings")
public class PersonController {
    private final PersonService personService;

    @PatchMapping("/{personId}")
    @Operation(
            summary = "Edit Person",
            description = "Allows to edit data about person (full name, phone)"
    )
        public ResponseEntity<?> editPerson(@PathVariable Integer personId, @RequestBody PersonDTO personDTO) {
        if (personService.findOne(personId).isPresent()) {
            Person existingPerson = personService.findOne(personId).get();
            existingPerson.setPhone(personDTO.getPhone());
            existingPerson.setFullName(personDTO.getFullName());
            personService.save(existingPerson);
            return ResponseEntity.ok(existingPerson);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
