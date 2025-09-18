import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
@Component({
  selector: 'app-actividades-component',
  imports: [CommonModule],
  templateUrl: './actividades-component.html',
  styleUrl: './actividades-component.css',
  animations: [
    trigger('fadeAnimation', [
      transition('* <=> *', [
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class ActividadesComponent {
  activeCategory: string = 'adventure';
  selectedImageIndex: number = 0;

  categories = [
    {
      id: 'adventure',
      title: 'AVENTURA',
      description:
        'Experience thrilling activities from water sports to mountain hiking. Our adventure packages are designed for all experience levels.',
      images: [
        'https://images.pexels.com/photos/2386310/pexels-photo-2386310.jpeg',
        'https://images.pexels.com/photos/7528007/pexels-photo-7528007.jpeg',
        'https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg',
      ],
      imageNames: ['Mountain Hiking', 'Water Sports', 'Zip Line Adventure'],
    },
    {
      id: 'wellness',
      title: 'SALUD Y BIENESTAR',
      description:
        'Rejuvenate your mind, body and soul with our spa treatments, yoga sessions, and wellness programs in serene environments.',
      images: [
        'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg',
        'https://images.pexels.com/photos/4099357/pexels-photo-4099357.jpeg',
        'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg',
      ],
      imageNames: ['Spa Treatments', 'Yoga Sessions', 'Meditation Programs'],
    },
    {
      id: 'dining',
      title: 'CULINARIA',
      description:
        'Savor exquisite culinary experiences with our world-class chefs, using locally sourced ingredients and international flavors.',
      images: [
        'https://images.pexels.com/photos/1581554/pexels-photo-1581554.jpeg',
        'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg',
        'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg',
      ],
      imageNames: ['Gourmet Restaurant', 'Ocean View Dining', "Chef's Special Menu"],
    },
    {
      id: 'transport',
      title: 'TRANSPORTE ',
      description:
        'Enjoy seamless transportation services from airport transfers to local excursions with our luxury vehicle fleet.',
      images: [
        'https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg',
        'https://images.pexels.com/photos/8978175/pexels-photo-8978175.jpeg',
        'https://images.pexels.com/photos/112452/pexels-photo-112452.jpeg',
      ],
      imageNames: ['Airport Transfers', 'Luxury Vehicle Fleet', 'Scenic Excursions'],
    },
    {
      id: 'breakfast',
      title: 'DESAYUNO',
      description:
        'Start your day with our lavish breakfast buffet featuring international cuisine, fresh pastries, and premium beverages.',
      images: [
        'https://images.pexels.com/photos/3761662/pexels-photo-3761662.jpeg',
        'https://images.pexels.com/photos/3186654/pexels-photo-3186654.jpeg',
        'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg',
      ],
      imageNames: ['Breakfast Buffet', 'Fresh Pastries', 'Premium Beverages'],
    },
  ];

  selectCategory(categoryId: string): void {
    this.activeCategory = categoryId;
    this.selectedImageIndex = 0; // Reset to first image when changing category
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  getCurrentCategory(): any {
    return this.categories.find((cat) => cat.id === this.activeCategory) || this.categories[0];
  }
}
