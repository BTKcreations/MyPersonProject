'use client';

import { useEffect, useState } from 'react';
import { getPortfolio } from '../lib/api';
import { Mail, ExternalLink, Code } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { ThemeToggle } from '../components/theme-toggle';

interface Profile {
  name: string;
  title: string;
  about: string;
  email: string;
  github_url: string;
  linkedin_url: string;
}

interface Skill {
  name: string;
  category: string;
}

interface Project {
  title: string;
  description: string;
  technologies: string[];
  github_url: string;
  live_url: string;
}

interface PortfolioData {
  profile: Profile | null;
  skills: Skill[];
  projects: Project[];
}

export default function Home() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getPortfolio();
        setData(result);
      } catch (error) {
        console.error('Failed to fetch portfolio data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-foreground">Loading AI Portfolio...</div>;
  }

  if (!data?.profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground">
        <h1 className="text-2xl font-bold mb-4">Welcome to AI Portfolio</h1>
        <p className="text-muted-foreground mb-8">No profile data found yet.</p>
        <Button asChild>
          <a href="/admin">Go to Admin Upload</a>
        </Button>
      </div>
    );
  }

  const { profile, skills, projects } = data;

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 border-b bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="font-bold text-lg tracking-tight">AI Portfolio</span>
          <ThemeToggle />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl mb-6">
            Hi, I&apos;m <span className="text-primary">{profile.name || 'Anonymous Developer'}</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            {profile.title || 'Software Engineer'}
          </p>
          <div className="flex justify-center space-x-6">
            {profile.github_url && (
              <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
              </a>
            )}
            {profile.linkedin_url && (
              <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
              </a>
            )}
            {profile.email && (
              <a href={`mailto:${profile.email}`} className="text-muted-foreground hover:text-primary transition-colors">
                <span className="sr-only">Email</span>
                <Mail className="h-6 w-6" />
              </a>
            )}
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
        >
          <h2 className="text-3xl font-bold mb-6">About Me</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {profile.about || 'No about information available yet.'}
          </p>
        </motion.div>
      </section>

      {/* Skills Section */}
      {skills && skills.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <motion.div
            className="max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold mb-8">Technical Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1 text-sm">
                  {skill.name}
                </Badge>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* Projects Section */}
      {projects && projects.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold mb-8">Featured Projects</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {projects.map((project, index) => (
                <Card key={index} className="flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <CardTitle className="text-xl">{project.title}</CardTitle>
                    <CardDescription className="line-clamp-3 h-[4.5rem]">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    {project.technologies && (
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.map((tech, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex space-x-4 border-t bg-muted/10 pt-4">
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                        <Code className="h-4 w-4 mr-1" /> Source
                      </a>
                    )}
                    {project.live_url && (
                      <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                        <ExternalLink className="h-4 w-4 mr-1" /> Live Demo
                      </a>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 border-t bg-background">
        <div className="max-w-4xl mx-auto px-4 text-center text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} {profile.name}. Powered by AI Portfolio Generator.
        </div>
      </footer>
    </main>
  );
}
