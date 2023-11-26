package com.nikonenko.propertyBoot.services;

import com.nikonenko.propertyBoot.repositories.ImageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ImageService {
    private final ImageRepository imageRepository;

    public ImageService(ImageRepository imageRepository) {
        this.imageRepository = imageRepository;
    }

    @Transactional
    public void deletePropertiesImages(Integer propertyId){imageRepository.deleteByPropertyId(propertyId);}
}
