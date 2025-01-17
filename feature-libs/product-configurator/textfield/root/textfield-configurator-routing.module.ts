/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ModuleWithProviders, NgModule } from '@angular/core';
import {
  provideDefaultConfig,
  RoutingModule as CoreRoutingModule,
} from '@spartacus/core';
import { CmsRouteModule } from '@spartacus/storefront';
import { defaultTextfieldRoutingConfig } from './default-textfield-routing-config';

/**
 * Provides the default cx routing configuration for the textfield configurator
 */
@NgModule({
  imports: [CoreRoutingModule.forRoot(), CmsRouteModule],
})
export class TextfieldConfiguratorRoutingModule {
  static forRoot(): ModuleWithProviders<TextfieldConfiguratorRoutingModule> {
    return {
      ngModule: TextfieldConfiguratorRoutingModule,
      providers: [provideDefaultConfig(defaultTextfieldRoutingConfig)],
    };
  }
}
