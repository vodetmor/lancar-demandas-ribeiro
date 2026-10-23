import React from 'react';
import {Composition} from 'remotion';
import {Video} from './Video';
import {DUR, FPS} from './tempos';

export const Root: React.FC = () => (
  <Composition id="LuizaRabelo" component={Video} durationInFrames={DUR} fps={FPS} width={1080} height={1920} />
);
