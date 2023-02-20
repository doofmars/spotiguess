import * as React from "react";
import './About.css';
import generatedBuildInfo from '../generatedBuildInfo.json';

export const About = () => {
  return (
    <div className="about text-white">
      <span><a href="https://github.com/doofmars/spotiguess">Spotiguess</a> is not affiliated with Spotify</span>
      <span>Made by <a href="https://doofmars.de">Doofmars</a></span>
      <span>Version: {generatedBuildInfo.version} - {generatedBuildInfo.gitCommitHash}</span>
    </div>
  )
}
