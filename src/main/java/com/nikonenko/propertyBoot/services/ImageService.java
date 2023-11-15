package com.nikonenko.propertyBoot.services;

import com.nikonenko.propertyBoot.models.Image;
import com.nikonenko.propertyBoot.repositories.ImageRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ImageService {
    private final ImageRepository imageRepository;

    public ImageService(ImageRepository imageRepository) {
        this.imageRepository = imageRepository;
    }

    public void saveImage(Image image) {
        imageRepository.save(image);
    }

    public List<Image> getImagesByPropertyId(Long propertyId) {
        return imageRepository.findByPropertyId(propertyId);
    }

    public Optional<Image> getImageById(Integer imageId) {
        return imageRepository.findById(imageId);
    }

    public void deleteImage(Integer imageId) {
        imageRepository.deleteById(imageId);
    }
}
