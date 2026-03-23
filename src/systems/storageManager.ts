import { PricingProject } from '../types/pricing';

const STORAGE_KEY = 'pricing_tier_projects';

export function saveProject(project: PricingProject): boolean {
  try {
    const projects = getProjects();
    const existingIndex = projects.findIndex(p => p.id === project.id);
    if (existingIndex >= 0) {
      projects[existingIndex] = project;
    } else {
      projects.push(project);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    return true;
  } catch (e) {
    console.error("Failed to save project to local storage. Quota may be exceeded.", e);
    return false;
  }
}

export function getProjects(): PricingProject[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to parse projects from local storage", e);
    return [];
  }
}

export function deleteProject(id: string) {
  try {
    const projects = getProjects().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (e) {
    console.error("Failed to delete project from local storage", e);
  }
}

export function clearAllProjects() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Failed to clear projects from local storage", e);
  }
}
