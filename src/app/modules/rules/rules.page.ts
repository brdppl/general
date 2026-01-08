import { Component, OnInit } from '@angular/core';
import { GoogleAnalyticsService } from 'ngx-google-analytics';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.page.html',
  styleUrls: ['./rules.page.scss'],
})
export class RulesPage implements OnInit {
  constructor(private gaService: GoogleAnalyticsService) {}

  public ngOnInit(): void {
    this.gaService.pageView('/rules', 'Página Regras');
  }
}
