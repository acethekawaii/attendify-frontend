import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Trustbox } from '@/app/shared/components/trustbox/trustbox';
import { FeatureCard } from '@/app/shared/components/feature-card/feature-card';
import { HOME_DESCRIPTION, HOME_STATS } from './home-document';

@Component({
  selector: 'app-home',
  imports: [RouterLink, NgOptimizedImage, Trustbox, FeatureCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  protected readonly stats = HOME_STATS;
  protected readonly description = HOME_DESCRIPTION;
}
