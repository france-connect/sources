/**
 * Statically import all the modules that might be imported dynamically
 * Static import are wat faster than dynamic ones
 *
 * At the time of writing, the execution time was reduced by 12 (from 170 to 14 seconds).
 */

import '../../../../../instances/bridge-http-proxy-rie/src/app.module';
import '../../../../../instances/core-fca-low/src/app.module';
import '../../../../../instances/core-fcp-high/src/app.module';
import '../../../../../instances/core-fcp-low/src/app.module';
import '../../../../../instances/csmr-account-instance/src/app.module';
import '../../../../../instances/csmr-fraud-instance/src/app.module';
import '../../../../../instances/csmr-hsm-high/src/app.module';
import '../../../../../instances/csmr-rie/src/app.module';
import '../../../../../instances/csmr-tracks-instance/src/app.module';
import '../../../../../instances/csmr-user-preferences-high/src/app.module';
import '../../../../../instances/eidas-bridge/src/app.module';
import '../../../../../instances/mock-data-provider/src/app.module';
import '../../../../../instances/mock-identity-provider-fca-low/src/app.module';
import '../../../../../instances/mock-identity-provider-fcp-high/src/app.module';
import '../../../../../instances/mock-identity-provider-fcp-low/src/app.module';
import '../../../../../instances/mock-rnipp/src/app.module';
import '../../../../../instances/mock-service-provider-fca-low/src/app.module';
import '../../../../../instances/mock-service-provider-fcp-high/src/app.module';
import '../../../../../instances/mock-service-provider-fcp-legacy/src/app.module';
import '../../../../../instances/mock-service-provider-fcp-low/src/app.module';
import '../../../../../instances/partners/src/app.module';
import '../../../../../instances/user-dashboard/src/app.module';
