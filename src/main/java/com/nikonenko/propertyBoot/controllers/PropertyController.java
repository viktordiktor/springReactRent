package com.nikonenko.propertyBoot.controllers;

import com.nikonenko.propertyBoot.dto.SinglePropertyResponse;
import com.nikonenko.propertyBoot.models.Image;
import com.nikonenko.propertyBoot.models.Person;
import com.nikonenko.propertyBoot.models.Property;
import com.nikonenko.propertyBoot.models.PropertyType;
import com.nikonenko.propertyBoot.services.ImageService;
import com.nikonenko.propertyBoot.services.PropertyService;
import com.nikonenko.propertyBoot.utils.JwtUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/props")
@CrossOrigin
@Tag(name="Property Controller", description="Responsible for actions with property ads")
public class PropertyController {
    private final PropertyService propertyService;
    private final ImageService imageService;
    private final JwtUtils jwtUtils;

    @GetMapping
    @Operation(
            summary = "Properties List",
            description = "Allows to obtain paginated, sorted and filtered data about properties"
    )
    public Page<Property> getProperties(@RequestParam(defaultValue = "0") int pageNumber,
                                        @RequestParam(defaultValue = "3") int pageSize,
                                        @RequestParam(required = false) PropertyType propertyType,
                                        @RequestParam(required = false) BigDecimal minPrice,
                                        @RequestParam(required = false) BigDecimal maxPrice,
                                        @RequestParam(required=false) String sortField,
                                        @RequestParam(required = false) String sortType) {
        if (propertyType != null || minPrice != null || maxPrice != null || sortField != null) {
            return propertyService.findFilteredProperties(propertyType, minPrice, maxPrice, sortField, sortType,
                    pageNumber, pageSize);
        } else {
            return propertyService.findAll(pageNumber, pageSize);
        }
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Property Data",
            description = "Allows to obtain data one property by ID"
    )
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

    @PatchMapping("/{propertyId}")
    @Operation(
            summary = "Edit Property",
            description = "Allows to edit data about property"
    )
    public ResponseEntity<?> editProperty(@RequestParam("images") MultipartFile[] imageFiles,
                                                 @RequestParam("propertyData") String propertyData,
                                                 @PathVariable Integer propertyId,
                                                 @RequestParam("propertyType") PropertyType propertyType) {
        if(propertyService.findOne(propertyId).isEmpty())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Incorrect property id!");
        Property property = propertyService.findOne(propertyId).get();
        Property updatedProperty = propertyService.parsePropertyData(propertyData);

        assert updatedProperty != null;
        property.setAddress(updatedProperty.getAddress());
        property.setDescription(updatedProperty.getDescription());
        property.setPrice(updatedProperty.getPrice());
        property.setRooms(updatedProperty.getRooms());
        property.setSquare(updatedProperty.getSquare());
        property.setType(propertyType);

        imageService.deletePropertiesImages(propertyId);

        return getResponseEntity(imageFiles, property);
    }

    private ResponseEntity<?> getResponseEntity(@RequestParam("images") MultipartFile[] imageFiles, Property property) {
        Set<Image> images = new HashSet<>();
        for (MultipartFile imageFile : imageFiles) {
            try {
                byte[] imageData = imageFile.getBytes();
                Image image = new Image();
                image.setImage(imageData);
                image.setProperty(property);
                images.add(image);
            } catch (IOException e) {
                return ResponseEntity.badRequest().body("Cannot read this image");
            }
        }
        property.setImages(images);

        propertyService.save(property);

        return ResponseEntity.ok(property);
    }

    @DeleteMapping("/{id}")
    @Operation(
            summary = "Soft Delete",
            description = "Allows to soft delete data about property"
    )
    public ResponseEntity<?> deletePropertyByUser(@PathVariable Integer id){
        if(propertyService.findOne(id).isEmpty()){
            return ResponseEntity.badRequest().body("Incorrect property ID");
        }
        Property deletedProperty = propertyService.findOne(id).get();
        propertyService.softDelete(id);
        return ResponseEntity.ok(deletedProperty);
    }

    @PostMapping("/{id}")
    @Operation(
            summary = "Cancel Soft Deletion",
            description = "Allows to restore data about soft-deleted property"
    )
    public ResponseEntity<?> restoreProperty(@PathVariable Integer id){
        if(propertyService.findOne(id).isEmpty()){
            return ResponseEntity.badRequest().body("Incorrect property ID");
        }
        Property restoredProperty = propertyService.findOne(id).get();
        propertyService.restore(id);
        return ResponseEntity.ok(restoredProperty);
    }

    @PostMapping("/new")
    @Operation(
            summary = "Add",
            description = "Allows to add new property"
    )
    public ResponseEntity<?> createProperty(@RequestHeader("Authorization") String authorizationHeader,
                                                 @RequestParam("images") MultipartFile[] imageFiles,
                                                 @RequestParam("propertyData") String propertyData,
                                                 @RequestParam("propertyType") PropertyType propertyType) {
        Property property = propertyService.parsePropertyData(propertyData);
        String token = authorizationHeader.substring(7);
        assert property != null;
        property.setUser(jwtUtils.extractUser(token));
        property.setType(propertyType);
        return getResponseEntity(imageFiles, property);
    }
}
