package com.nikonenko.propertyBoot.controllers;

import com.nikonenko.propertyBoot.dto.PersonDTO;
import com.nikonenko.propertyBoot.models.Person;
import com.nikonenko.propertyBoot.services.PersonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/person")
@RequiredArgsConstructor
@CrossOrigin
public class PersonController {
    private final PersonService personService;

    @PatchMapping("/{personId}")
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
