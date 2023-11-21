package com.nikonenko.propertyBoot.services;

import com.nikonenko.propertyBoot.models.Image;
import com.nikonenko.propertyBoot.repositories.ImageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ImageService {
    private final ImageRepository imageRepository;

    public ImageService(ImageRepository imageRepository) {
        this.imageRepository = imageRepository;
    }

    @Transactional
    public void saveImage(Image image) {
        imageRepository.save(image);
    }

    public List<Image> getImagesByPropertyId(Integer propertyId) {
        return imageRepository.findByPropertyId(propertyId);
    }

    public Optional<Image> getImageById(Integer imageId) {
        return imageRepository.findById(imageId);
    }

    @Transactional
    public void deleteImage(Integer imageId) {
        imageRepository.deleteById(imageId);
    }

    @Transactional
    public void deletePropertiesImages(Integer propertyId){imageRepository.deleteByPropertyId(propertyId);}
}
