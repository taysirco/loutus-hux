#!/bin/bash

# Script to optimize images while maintaining filenames and relative quality
# Uses imagemin for optimization

# Set color for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting image optimization...${NC}"

# Create optimized_images directory if it doesn't exist
mkdir -p optimized_images

# Process each image directory
process_directory() {
    local source_dir=$1
    local quality=${2:-80}
    
    # Skip if source directory doesn't exist
    if [ ! -d "$source_dir" ]; then
        echo -e "${YELLOW}Directory $source_dir does not exist, skipping.${NC}"
        return
    fi
    
    # Create target directory maintaining directory structure
    local target_dir="optimized_images/${source_dir}"
    mkdir -p "$target_dir"
    
    echo -e "${GREEN}Processing directory: $source_dir${NC}"
    
    # Process JPEG images
    find "$source_dir" -type f \( -iname "*.jpg" -o -iname "*.jpeg" \) | while read -r img; do
        local filename=$(basename "$img")
        local dir_path=$(dirname "$img")
        local rel_path="${dir_path#$source_dir/}"
        local target_path="optimized_images/$dir_path"
        
        mkdir -p "$target_path"
        
        echo -e "Optimizing JPEG: $img"
        imagemin "$img" --plugin=mozjpeg --out-dir="$target_path"
        
        # Print size comparison if file was created
        if [ -f "$target_path/$filename" ]; then
            local original_size=$(stat -f%z "$img")
            local optimized_size=$(stat -f%z "$target_path/$filename")
            local reduction=$((100 - (optimized_size * 100 / original_size)))
            echo -e "  Reduced by ${GREEN}$reduction%${NC} ($original_size → $optimized_size bytes)"
        else
            echo -e "${YELLOW}  Failed to optimize $img${NC}"
        fi
    done
    
    # Process PNG images
    find "$source_dir" -type f -iname "*.png" | while read -r img; do
        local filename=$(basename "$img")
        local dir_path=$(dirname "$img")
        local rel_path="${dir_path#$source_dir/}"
        local target_path="optimized_images/$dir_path"
        
        mkdir -p "$target_path"
        
        echo -e "Optimizing PNG: $img"
        imagemin "$img" --plugin=pngquant --out-dir="$target_path"
        
        # Print size comparison if file was created
        if [ -f "$target_path/$filename" ]; then
            local original_size=$(stat -f%z "$img")
            local optimized_size=$(stat -f%z "$target_path/$filename")
            local reduction=$((100 - (optimized_size * 100 / original_size)))
            echo -e "  Reduced by ${GREEN}$reduction%${NC} ($original_size → $optimized_size bytes)"
        else
            echo -e "${YELLOW}  Failed to optimize $img${NC}"
        fi
    done
    
    # Process WebP images by copying them (imagemin doesn't always handle webp well)
    find "$source_dir" -type f -iname "*.webp" | while read -r img; do
        local filename=$(basename "$img")
        local dir_path=$(dirname "$img")
        local rel_path="${dir_path#$source_dir/}"
        local target_path="optimized_images/$dir_path"
        
        mkdir -p "$target_path"
        
        echo -e "Copying WebP: $img"
        cp "$img" "$target_path/$filename"
        
        # Print size comparison
        local original_size=$(stat -f%z "$img")
        local optimized_size=$(stat -f%z "$target_path/$filename")
        echo -e "  Copied WebP file ($original_size bytes)"
    done
}

# Process root level images
process_directory "."

# Process main image directories
if [ -d "images" ]; then
    process_directory "images"
    
    # Process subdirectories in images/
    for dir in images/*/; do
        if [ -d "$dir" ]; then
            process_directory "${dir%/}"
        fi
    done
fi

# Process Public image directories
if [ -d "Public/images" ]; then
    process_directory "Public/images"
    
    # Process subdirectories in Public/images/
    for dir in Public/images/*/; do
        if [ -d "$dir" ]; then
            process_directory "${dir%/}"
        fi
    done
fi

echo -e "${GREEN}Image optimization complete!${NC}"
echo -e "${GREEN}Optimized images are in the 'optimized_images' directory.${NC}"
echo -e "${YELLOW}Verify the optimized images before replacing originals.${NC}"

# Calculate total size savings
original_total=$(find . -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.webp" \) -not -path "./optimized_images/*" -not -path "./node_modules/*" -exec stat -f%z {} \; | awk '{sum+=$1} END {print sum}')
optimized_total=$(find ./optimized_images -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.webp" \) -exec stat -f%z {} \; | awk '{sum+=$1} END {print sum}')

if [ -n "$original_total" ] && [ -n "$optimized_total" ] && [ "$original_total" -gt 0 ]; then
    reduction=$((100 - (optimized_total * 100 / original_total)))
    echo -e "${GREEN}Original size: $original_total bytes${NC}"
    echo -e "${GREEN}Optimized size: $optimized_total bytes${NC}"
    echo -e "${GREEN}Overall reduction: $reduction%${NC}"
fi 