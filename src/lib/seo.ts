/**
 * SEO Configuration for Game One
 * Manages meta tags and SEO optimization for different pages
 */

export interface SEOMetaTags {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
}

export const seoConfig: Record<string, SEOMetaTags> = {
  home: {
    title: "Game One - Top Free Online Games | Fun Games, IQ Tests, Math Games, Quiz Games",
    description:
      "Game One is the #1 platform for free online games. Play top games including IQ tests, math games, fun games, quiz games, brain training & mind games. No download needed!",
    keywords:
      "game, games, top game, fun game, best game, free game, online game, math game, iq game, brain game, quiz game, free online games, fun games, best games",
    ogTitle: "Game One - Top Free Online Games & Fun Games for Everyone",
    ogDescription:
      "Play the best free online games on Game One! Discover top games including fun games, math games, IQ tests, quizzes & brain training.",
    ogImage: "https://game-one-lyart.vercel.app/og-image.png",
    twitterTitle: "Game One - Top Free Online Games & Fun Games",
    twitterDescription: "Play amazing free online games! Top games, fun games, math games, IQ tests, quizzes and brain challenges.",
  },
  iqTest: {
    title: "IQ Test Game - Free Online IQ Challenge | Game One",
    description:
      "Test your IQ with our free online IQ test game. Challenge your logical thinking with pattern recognition, problem-solving puzzles and brain training exercises. Play instantly on Game One!",
    keywords:
      "iq test, iq game, iq challenge, iq test online, brain test, logical thinking, puzzle game, brain training, iq score, test iq",
    ogTitle: "IQ Test Game - Free Online IQ Challenge",
    ogDescription: "Challenge your logical thinking with our free IQ test game on Game One. Pattern recognition, puzzles & brain training.",
    ogImage: "https://game-one-lyart.vercel.app/og-image.png",
    twitterTitle: "IQ Test Game - Free Online IQ Challenge",
    twitterDescription: "Test your IQ with our free online game. Pattern recognition and problem-solving challenges.",
  },
  quiz: {
    title: "Quiz Master - Free Online Quiz Game | Test Your Knowledge | Game One",
    description:
      "Play Quiz Master, the ultimate free online quiz game. Test your knowledge across science, history, sports, entertainment and more. Challenge yourself with our fun quiz games daily!",
    keywords:
      "quiz game, quiz games, online quiz, free quiz, knowledge quiz, trivia game, fun quiz, quiz challenge, brain quiz, test knowledge",
    ogTitle: "Quiz Master - Free Online Quiz Game & Knowledge Challenge",
    ogDescription:
      "Play Quiz Master and test your knowledge across various topics. Free online quiz game with fun questions and challenges.",
    ogImage: "https://game-one-lyart.vercel.app/og-image.png",
    twitterTitle: "Quiz Master - Free Online Quiz Game",
    twitterDescription: "Test your knowledge with our fun online quiz games. Challenge yourself with quiz master!",
  },
  funnyGames: {
    title: "Funny Games - Free Fun Games to Play Online | Game One",
    description:
      "Play our collection of funny games online for free! Lighten up with fun mini-games that will make you laugh while thinking. Enjoy instant fun games with no download required.",
    keywords:
      "funny game, funny games, fun game, fun games, fun online games, casual games, mini games, funny challenges, entertainment games, play for fun",
    ogTitle: "Funny Games - Free Fun Games to Make You Laugh",
    ogDescription: "Play funny games online for free! Fun mini-games that entertain while you challenge your mind.",
    ogImage: "https://game-one-lyart.vercel.app/og-image.png",
    twitterTitle: "Funny Games - Free Fun Games Online",
    twitterDescription: "Enjoy funny games and mini-games. Free fun games that make you laugh!",
  },
  mathBasic: {
    title: "Basic Math Game - Free Math Challenges | Improve Your Skills | Game One",
    description:
      "Play Basic Math Game and sharpen your arithmetic skills with quick calculation challenges. Free online math game for all ages. Improve mental math and math skills instantly!",
    keywords:
      "math game, math games, math challenge, basic math, arithmetic game, calculation game, math skills, mental math, math test, educational game",
    ogTitle: "Basic Math Game - Free Online Math Challenges",
    ogDescription: "Sharpen your arithmetic skills with our free basic math game. Quick calculation challenges on Game One!",
    ogImage: "https://game-one-lyart.vercel.app/og-image.png",
    twitterTitle: "Basic Math Game - Free Math Challenges",
    twitterDescription: "Improve your math skills with our free math game. Quick and fun arithmetic challenges!",
  },
  mathAdvanced: {
    title: "Advanced Math Game - Free Hard Math Challenges | Game One",
    description:
      "Challenge yourself with Advanced Math Game - the ultimate free math challenge for math enthusiasts. Solve complex problems, improve math skills and compete. No download needed!",
    keywords:
      "math game, advanced math, math challenge, algebra, geometry, hard math, math problem, math test, brain math, advanced games",
    ogTitle: "Advanced Math Game - Free Hard Math Challenges",
    ogDescription: "Challenge your advanced math skills with complex problems and calculations. Free online advanced math game.",
    ogImage: "https://game-one-lyart.vercel.app/og-image.png",
    twitterTitle: "Advanced Math Game - Free Hard Math Challenges",
    twitterDescription: "Test advanced math skills with complex challenges. Free math game on Game One!",
  },
  newsQuiz: {
    title: "News Quiz Game - Free Daily News Challenges | Game One",
    description:
      "Play News Quiz Game and test your current affairs knowledge. Free daily news quizzes powered by AI. Stay updated while having fun with our latest news challenges!",
    keywords:
      "news quiz, quiz game, current affairs, news challenge, ai quiz, daily quiz, knowledge quiz, trivia game, news game, test knowledge",
    ogTitle: "News Quiz Game - Free Daily AI-Powered News Quizzes",
    ogDescription: "Test your news knowledge with AI-generated news quizzes. Free daily news challenges on Game One!",
    ogImage: "https://game-one-lyart.vercel.app/og-image.png",
    twitterTitle: "News Quiz Game - Free Daily News Quizzes",
    twitterDescription: "Challenge yourself with daily news quizzes. Test your knowledge of current affairs!",
  },
  carGame: {
    title: "Car Game - Free Online Racing Game | Game One",
    description:
      "Play Car Game - the exciting free online racing and driving game. Drive fast, complete challenges and have fun. Play now on Game One - no download needed!",
    keywords:
      "car game, racing game, driving game, car racing, fun game, online game, free car game, race game, driving challenge",
    ogTitle: "Car Game - Free Online Racing & Driving Game",
    ogDescription: "Drive fast and complete challenges in our free car game. Exciting racing game on Game One!",
    ogImage: "https://game-one-lyart.vercel.app/og-image.png",
    twitterTitle: "Car Game - Free Online Racing Game",
    twitterDescription: "Play exciting free car racing game. Drive, race and have fun on Game One!",
  },
};

export function updateMetaTags(config: SEOMetaTags) {
  // Update title
  document.title = config.title;

  // Update or create meta tags
  updateMetaTag("name", "description", config.description);
  updateMetaTag("name", "keywords", config.keywords);
  updateMetaTag("property", "og:title", config.ogTitle);
  updateMetaTag("property", "og:description", config.ogDescription);
  updateMetaTag("property", "og:image", config.ogImage);
  updateMetaTag("name", "twitter:title", config.twitterTitle);
  updateMetaTag("name", "twitter:description", config.twitterDescription);
}

function updateMetaTag(attribute: string, name: string, content: string) {
  let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute(attribute, name);
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
}
