import { Component, Input, Output, EventEmitter, ViewChild, ViewChildren, QueryList, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ButtonComponent } from '@aum/ui/buttons';

export interface CarouselItem {
    imgUrl: string;
    title?: string;
    description?: string;
}
export interface CarouselCardClickEvent {
    item: CarouselItem;
    index: number;
}

const DEFAULT_IMAGE_HEIGHT = 'calc(25rem * var(--ui-scale))';
const DEFAULT_IMAGE_WIDTH = 'calc(25rem * var(--ui-scale))';


@Component({
  selector: 'aum-carousel',
  imports: [ButtonComponent, CommonModule, MatTooltipModule],
  templateUrl: './carousel.html',
  styleUrl: './carousel.scss',
})
export class CarouselComponent implements AfterViewInit, OnDestroy {
    @Input() carouselItems: CarouselItem[] = [];
    @ViewChild('carouselContent') carouselContent!: ElementRef<HTMLDivElement>;
    @ViewChildren('carouselCard') carouselCards!: QueryList<ElementRef<HTMLDivElement>>;

    @Input() showArrows = true;
    @Input() itemHeight = DEFAULT_IMAGE_HEIGHT;
    @Input() itemWidth = DEFAULT_IMAGE_WIDTH;
    @Input() infiniteScroll = false;
    @Input() scrollMode: 'item' | 'viewport' = 'item';
    @Input() animationDuration = 20;

    @Output() cardClick = new EventEmitter<CarouselCardClickEvent>();

    canScrollLeft = true;
    canScrollRight = true;
    hasOverflow = false;

    private scrollListener?: () => void;
    private resizeListener?: () => void;

    ngAfterViewInit() {
        setTimeout(() => {
            this.updateScrollButtons();
        });
        this.setupEventListeners();
    }

    ngOnDestroy() {
        this.cleanupEventListeners();
    }

    private setupEventListeners() {
        const element = this.carouselContent.nativeElement;
        this.scrollListener = () => {
            this.updateScrollButtons();
        };
        element.addEventListener('scroll', this.scrollListener);

        this.resizeListener = () => {
            this.updateScrollButtons();
        };
        window.addEventListener('resize', this.resizeListener);
    }

    private cleanupEventListeners() {
        const element = this.carouselContent.nativeElement;
        if (this.scrollListener) {
            element.removeEventListener('scroll', this.scrollListener);
        }
        if (this.resizeListener) {
            window.removeEventListener('resize', this.resizeListener);
        }
    }

    scrollLeft() {
        const distance = this.calculateScrollDistance();
        this.carouselContent.nativeElement.scrollBy({
            left: -distance,
            behavior: 'smooth'
        });
    }

    scrollRight() {
        const distance = this.calculateScrollDistance();
        this.carouselContent.nativeElement.scrollBy({
            left: distance,
            behavior: 'smooth'
        });
    }

    private updateScrollButtons() {
        const element = this.carouselContent.nativeElement;
        const scrollWidth = element.scrollWidth;
        const clientWidth = element.clientWidth;

        // Check if content overflows the viewport
        this.hasOverflow = scrollWidth > clientWidth;

        this.canScrollLeft = element.scrollLeft > 0;
        this.canScrollRight = element.scrollLeft < (scrollWidth - clientWidth);
    }

    private parseItemWidth(): number {
        // Use actual rendered width from DOM for accuracy
        if (this.carouselCards && this.carouselCards.first) {
            return this.carouselCards.first.nativeElement.offsetWidth;
        }
        // Fallback to default
        return 300;
    }

    private calculateScrollDistance(): number {
        if (this.scrollMode === 'viewport') {
            // Return the visible width of the carousel container
            return this.carouselContent.nativeElement.clientWidth;
        } else {
            // Calculate single item width + gap
            const itemWidthPx = this.parseItemWidth();
            // Get gap from computed styles or measure spacing between cards
            let gapPx = 4; // Default gap from SCSS

            // Try to get actual gap from DOM if we have multiple cards
            if (this.carouselCards && this.carouselCards.length > 1) {
                const firstCard = this.carouselCards.first.nativeElement;
                const secondCard = this.carouselCards.toArray()[1].nativeElement;
                const gap = secondCard.offsetLeft - (firstCard.offsetLeft + firstCard.offsetWidth);
                if (gap > 0) {
                    gapPx = gap;
                }
            }

            return itemWidthPx + gapPx;
        }
    }

    onCardClick(index: number) {
        const event: CarouselCardClickEvent = {
            item: this.carouselItems[index],
            index,
        };

        this.cardClick.emit(event);
    }

    private convertToRem(value: string): string {
        if (value.endsWith('px')) {
            const pxValue = parseFloat(value);
            const remValue = pxValue / 16;
            return `calc(${remValue}rem * var(--ui-scale))`;
        }
        if (value.endsWith('rem')) {
            return `calc(${value} * var(--ui-scale))`;
        }
        return value;
    }

    getImageHeight(): string {
        return this.convertToRem(this.itemHeight);
    }

    getImageWidth(): string {
        return this.convertToRem(this.itemWidth);
    }

    getAnimationDuration(): string {
        return `${this.animationDuration}s`;
    }
}
