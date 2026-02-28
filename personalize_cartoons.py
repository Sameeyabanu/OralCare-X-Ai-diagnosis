"""
Script to create personalized cartoon variations for oral care tips
Uses the provided character image and modifies props for each activity
"""

from PIL import Image, ImageDraw, ImageFont
import os

# Create assets directory if it doesn't exist
os.makedirs('assets', exist_ok=True)

# Note: You need to provide your base character image
# For now, we'll create variations by modifying the existing image

def create_personalized_images():
    """
    Creates personalized cartoon versions for each oral care tip
    This script expects a base image: 'base_character.png'
    """
    
    try:
        # Load the base character image
        base_image_path = 'personal_character.png'
        
        if not os.path.exists(base_image_path):
            print(f"Error: {base_image_path} not found!")
            print("Please save your character image as 'personal_character.png' in the workspace root.")
            return
        
        # Load base image
        img = Image.open(base_image_path)
        print(f"Loaded image: {img.size} pixels")
        
        # Ensure image is RGBA for transparency
        if img.mode != 'RGBA':
            img = img.convert('RGBA')
        
        # Create variations for each tip activity
        tips = {
            'brushing': 'Brushing Time!',
            'flossing': 'Flossing Daily!',
            'rinsing': 'Rinse & Clean!',
            'avoiding_sugar': 'No Sugar Please!'
        }
        
        for tip_key, label in tips.items():
            # Create a copy for modification
            tip_image = img.copy()
            
            # Add label at the bottom
            draw = ImageDraw.Draw(tip_image)
            
            # Try to load a nice font, fallback to default
            try:
                font = ImageFont.truetype("arial.ttf", 24)
            except:
                font = ImageFont.load_default()
            
            # Get image dimensions
            width, height = tip_image.size
            
            # Add semi-transparent background for text
            text = label
            bbox = draw.textbbox((0, 0), text, font=font)
            text_width = bbox[2] - bbox[0]
            text_height = bbox[3] - bbox[1]
            
            # Draw text at bottom center
            text_x = (width - text_width) // 2
            text_y = height - text_height - 20
            
            # Add white text with slight shadow
            draw.text((text_x + 2, text_y + 2), text, fill=(0, 0, 0, 100), font=font)
            draw.text((text_x, text_y), text, fill=(255, 255, 255, 255), font=font)
            
            # Save the variation
            output_path = f'assets/cartoon-personalized-{tip_key}.png'
            tip_image.save(output_path)
            print(f"✓ Created: {output_path}")
        
        print("\n✓ All personalized cartoons created successfully!")
        return True
        
    except Exception as e:
        print(f"Error creating personalized images: {e}")
        return False

if __name__ == "__main__":
    create_personalized_images()
