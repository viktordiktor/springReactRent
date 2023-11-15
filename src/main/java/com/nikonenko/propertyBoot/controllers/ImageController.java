package com.nikonenko.propertyBoot.controllers;

import com.nikonenko.propertyBoot.models.Image;
import com.nikonenko.propertyBoot.models.Property;
import com.nikonenko.propertyBoot.services.ImageService;
import com.nikonenko.propertyBoot.services.PropertyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/image")
public class ImageController {
    private final PropertyService propertyService;
    private final ImageService imageService;

    @Autowired
    public ImageController(PropertyService propertyService, ImageService imageService) {
        this.propertyService = propertyService;
        this.imageService = imageService;
    }

    @PostMapping
    public ResponseEntity<String> addImage(@RequestParam("propertyId") Integer propertyId,
                                           @RequestParam("imageFile") MultipartFile imageFile) {
        try {
            // Получаем объект недвижимости по идентификатору
            if(propertyService.findOne(propertyId).isEmpty())
                return ResponseEntity.badRequest().body("Недвижимость с указанным идентификатором не найдена");
            Property property = propertyService.findOne(propertyId).get();

            // Проверяем, что загруженный файл не пустой
            if (imageFile.isEmpty()) {
                return ResponseEntity.badRequest().body("Не удалось загрузить изображение");
            }
            // Читаем содержимое файла из MultipartFile в массив байтов
            byte[] imageData = imageFile.getBytes();
            // Создаем новый объект Image
            Image image = new Image(property, imageData);
            // Сохраняем объект Image в базе данных
            imageService.saveImage(image);

            return ResponseEntity.ok("Изображение успешно добавлено");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Ошибка при загрузке изображения");
        }
    }
}
