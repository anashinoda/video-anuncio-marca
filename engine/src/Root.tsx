import React from 'react';
import { Composition } from 'remotion';
import { VideoAnuncio } from './compositions/VideoAnuncio';
import { demoProject } from './projects/demo';
import { ProjectConfig } from './types';

export const RemotionRoot: React.FC = () => {
  const defaultProps: { project: ProjectConfig } = {
    project: demoProject,
  };

  return (
    <>
      {/* 9:16 — Reels, TikTok, YouTube Shorts (padrão) */}
      <Composition
        id="Reels9x16"
        component={VideoAnuncio}
        width={1080}
        height={1920}
        fps={demoProject.fps}
        durationInFrames={demoProject.durationInFrames}
        defaultProps={defaultProps}
        calculateMetadata={({ props }) => ({
          fps: props.project.fps,
          durationInFrames: props.project.durationInFrames,
        })}
      />

      {/* 1:1 — Feed Quadrado Instagram / Meta Ads */}
      <Composition
        id="Feed1x1"
        component={VideoAnuncio}
        width={1080}
        height={1080}
        fps={demoProject.fps}
        durationInFrames={demoProject.durationInFrames}
        defaultProps={defaultProps}
        calculateMetadata={({ props }) => ({
          fps: props.project.fps,
          durationInFrames: props.project.durationInFrames,
        })}
      />

      {/* 4:5 — Feed Vertical Instagram / Meta Ads */}
      <Composition
        id="Feed4x5"
        component={VideoAnuncio}
        width={1080}
        height={1350}
        fps={demoProject.fps}
        durationInFrames={demoProject.durationInFrames}
        defaultProps={defaultProps}
        calculateMetadata={({ props }) => ({
          fps: props.project.fps,
          durationInFrames: props.project.durationInFrames,
        })}
      />

      {/* 16:9 — YouTube / VSL Horizontal */}
      <Composition
        id="Landscape16x9"
        component={VideoAnuncio}
        width={1920}
        height={1080}
        fps={demoProject.fps}
        durationInFrames={demoProject.durationInFrames}
        defaultProps={defaultProps}
        calculateMetadata={({ props }) => ({
          fps: props.project.fps,
          durationInFrames: props.project.durationInFrames,
        })}
      />
    </>
  );
};
