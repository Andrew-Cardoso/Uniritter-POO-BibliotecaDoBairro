import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { take } from 'rxjs/operators';
import { Roles } from '../_enums/roles';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';

@Directive({
  selector: '[hasRole]'
})
export class HasRoleDirective implements OnInit {
	@Input() hasRole: Roles[];
	private user: User;

	constructor(accountService: AccountService, private viewContainerRef: ViewContainerRef, private templateRef: TemplateRef<unknown>) {
		accountService.currentUser$.pipe(take(1)).subscribe((user) => (this.user = user));
	}
	ngOnInit(): void {
    if (this.user?.roles?.some?.((role) => this.hasRole.includes(role))) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
      return;
    }
		
    this.viewContainerRef.clear();
	}
}
