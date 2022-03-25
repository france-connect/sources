/**
 * typical logs of core-legacy
 * @example: 
 * const logs = {
    name: 'FranceConnect',
    hostname: 'fc-core',
    pid: 101,
    tech_id: '18e2a4f4-295f-44af-a439-0b98e0f26dc7',
    level: 30,
    fiId: '09a1a257648c1742c74d6a3d84b31943',
    fiSub: '82',
    fsId: '6925fb8143c76eded44d32b40c0cb1006065f7f003de52712b78985704f39950',
    fsSub: 'd3b57b2d664198a340c315c2b11dc129b982b13274512564ba8e1b1e2eab9cc5v1',
    accountId: 'test_TRACE_USER',
    userIp: '172.30.0.6, 172.31.0.11, 172.30.0.5',
    action: 'authentication',
    type_action: 'get_user_info',
    fi: 'fip1',
    fs_label: 'Site Usagers',
    eidas: 1,
    msg: '',
    time: '2022-01-24T15:58:20.972Z',
    v: 0,
    mock: '::TRACE::',
  };
  
 */

import { ICsmrTracksElasticInput } from '@fc/csmr-tracks';

export interface ICsmrTracksLegacyTrack {
  name: string;
  fiId: string;
  fiSub: string;
  fsId: string;
  fsSub: string;
  accountId: string;
  scopes: string;
  userIp: string; // /!\ "172.16.3.1, 172.16.2.6"
  action: string;
  // Legacy property name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  type_action: string;
  fi: string;
  // Legacy property name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  fs_label: string;
  eidas: number | string;
  time: string;
}

export type ICsmrTracksInputLegacy =
  ICsmrTracksElasticInput<ICsmrTracksLegacyTrack>;
