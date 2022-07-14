import { Inject, Injectable } from '@angular/core';
import { Resolutions } from './enums/resolutions.enum';

@Injectable({
  providedIn: 'root'
})
export class ResolutionService {
  constructor(@Inject('Window') private window) {}
  resolutionRanges: any = {
    mobile: {
      max: 320
    },
    phablet: {
      min: 321,
      max: 480
    },
    tablet: {
      min: 481,
      max: 768
    },
    desktop: {
      min: 769,
      max: 1024
    },
    largeDesktop: {
      min: 1025
    }
  };

  Get(): number {
    // http://www.w3schools.com/jsref/prop_win_innerheight.asp
    const width = this.window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    if (!width || isNaN(width)) {
      return Resolutions.Desktop;
    }

    if (width <= this.resolutionRanges.mobile.max) {
      return Resolutions.Mobile;
    }

    if (width >= this.resolutionRanges.phablet.min && width <= this.resolutionRanges.phablet.max) {
      return Resolutions.Phablet;
    }

    if (width >= this.resolutionRanges.tablet.min && width <= this.resolutionRanges.tablet.max) {
      return Resolutions.Tablet;
    }

    if (width >= this.resolutionRanges.desktop.min && width <= this.resolutionRanges.desktop.max) {
      return Resolutions.Desktop;
    }

    if (width >= this.resolutionRanges.largeDesktop.min) {
      return Resolutions.LargeDesktop;
    }
  }
}
