package com.nikonenko.propertyBoot.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nikonenko.propertyBoot.dto.SinglePropertyResponse;
import com.nikonenko.propertyBoot.models.Image;
import com.nikonenko.propertyBoot.models.Person;
import com.nikonenko.propertyBoot.models.Property;
import com.nikonenko.propertyBoot.services.PropertyService;
import com.nikonenko.propertyBoot.utils.JwtUtils;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/api/props")
@CrossOrigin
public class PropertyController {
    private final PropertyService propertyService;
    private final JwtUtils jwtUtils;


    public PropertyController(PropertyService propertyService, JwtUtils jwtUtils) {
        this.propertyService = propertyService;
        this.jwtUtils = jwtUtils;
    }

    @GetMapping
    public Page<Property> getProperties(@RequestParam(defaultValue = "0") int pageNumber,
                                        @RequestParam(defaultValue = "3") int pageSize) {
        return propertyService.findAll(pageNumber, pageSize);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SinglePropertyResponse> getProperty(@PathVariable Integer id) {
        Optional<Property> property = propertyService.findOne(id);

        if (property.isPresent()) {
            Property propertyObj = property.get();
            Person person = propertyObj.getUser().getPerson();

            SinglePropertyResponse response = SinglePropertyResponse.builder()
                    .person(person)
                    .property(propertyObj)
                    .build();

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/sorted-properties")
    public Page<Property> getSortedProperties(
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "price,asc") String sortBy) {
        return propertyService.findAllSorted(pageNumber, pageSize, sortBy);
    }

    @PostMapping("/new")
    public ResponseEntity<String> createProperty(@RequestHeader("Authorization") String authorizationHeader,
                                                 @RequestParam("images") MultipartFile[] imageFiles,
                                                 @RequestParam("propertyData") String propertyData) {
        Property property = parsePropertyData(propertyData);
        String token = authorizationHeader.substring(7);
        assert property != null;
        property.setUser(jwtUtils.extractUser(token));
        Set<Image> images = new HashSet<>();
        for (MultipartFile imageFile : imageFiles) {
            try {
                byte[] imageData = imageFile.getBytes();
                Image image = new Image();
                image.setImage(imageData);
                image.setProperty(property);
                images.add(image);
            } catch (IOException e) {
                return ResponseEntity.badRequest().body("Ошибка чтения файла изображения");
            }
        }
        property.setImages(images);

        propertyService.save(property);

        return ResponseEntity.ok("Объект недвижимости успешно создан");
    }

    private Property parsePropertyData(String propertyData) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readValue(propertyData, Property.class);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return null;
        }
    }
}
