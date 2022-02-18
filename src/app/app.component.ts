import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent {

    menuMode = 'overlay';
    //menuMode = 'static';

    inputStyle = 'filled';

    ripple: boolean = true;

    darkMode: boolean = true;

    lightMode: boolean = false;

    theme = 'light';

    constructor(private primengConfig: PrimeNGConfig) {
    }

    ngOnInit() {
        this.primengConfig.ripple = true;
        this.ripple = true;
        document.documentElement.style.fontSize = '12px';
    }
}
