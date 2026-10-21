import React from 'react';
import {Composition} from 'remotion';
import {SemenitVideo} from './video';

export const Root: React.FC = () => (
  <Composition
    id="SemenitShorts"
    component={SemenitVideo}
    durationInFrames={1800}
    fps={30}
    width={1080}
    height={1920}
  />
);