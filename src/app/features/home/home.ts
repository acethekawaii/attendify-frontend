import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Trustbox } from '@/app/shared/components/trustbox/trustbox';
import { FeatureCard } from '@/app/shared/components/feature-card/feature-card';

@Component({
  selector: 'app-home',
  imports: [RouterLink, NgOptimizedImage, Trustbox, FeatureCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {}
