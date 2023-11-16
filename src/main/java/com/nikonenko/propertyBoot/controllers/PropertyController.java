package com.nikonenko.propertyBoot.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nikonenko.propertyBoot.models.Image;
import com.nikonenko.propertyBoot.models.Property;
import com.nikonenko.propertyBoot.services.PropertyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/props")
public class PropertyController {
    private final PropertyService propertyService;

    @Autowired
    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @GetMapping
    public Page<Property> getProperties(@RequestParam(defaultValue = "0") int pageNumber,
                                        @RequestParam(defaultValue = "3") int pageSize) {
        System.out.println("Page: " + pageNumber);
        System.out.println("Size: " + pageSize);
        return propertyService.findAll(pageNumber, pageSize);
    }

    @GetMapping("/sorted-properties")
    public Page<Property> getSortedProperties(
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "price,asc") String sortBy) {
        return propertyService.findAllSorted(pageNumber, pageSize, sortBy);
    }

    @PostMapping("/new")
    public ResponseEntity<String> createProperty(@RequestParam("images") MultipartFile[] imageFiles,
                                                 @RequestParam("propertyData") String propertyData) {
        // Разбор данных объекта недвижимости из строки propertyData
        Property property = parsePropertyData(propertyData);

        // Создание и сохранение объектов Image для каждого загруженного файла
        Set<Image> images = new HashSet<>();
        for (MultipartFile imageFile : imageFiles) {
            try {
                byte[] imageData = imageFile.getBytes();
                Image image = new Image();
                image.setImage(imageData);
                image.setProperty(property);

                images.add(image);
            } catch (IOException e) {
                // Обработка ошибки чтения файла изображения
                // Возможно, вы захотите прервать процесс создания объекта недвижимости и вернуть сообщение об ошибке
                return ResponseEntity.badRequest().body("Ошибка чтения файла изображения");
            }
        }

        // Установка связи между объектом недвижимости и картинками
        property.setImages(images);

        // Сохранение объекта недвижимости и картинок в базу данных
        propertyService.save(property);

        return ResponseEntity.ok("Объект недвижимости успешно создан");
    }

    private Property parsePropertyData(String propertyData) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readValue(propertyData, Property.class);
        } catch (JsonProcessingException e) {
            // Обработка ошибки разбора данных
            // Возможно, вы захотите вернуть null или бросить исключение, чтобы указать на проблему разбора данных
            e.printStackTrace();
            return null;
        }
    }
}
