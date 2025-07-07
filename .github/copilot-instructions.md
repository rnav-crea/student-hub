# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Context
This is a React frontend for a Student Collaboration Hub web application. The project uses:
- React with Vite for fast development
- React Router for client-side routing
- Axios for API requests
- JWT authentication stored in localStorage
- Basic CSS styling for forms and layouts

## Architecture
- Pages are in `src/pages/` directory
- Reusable components are in `src/components/` directory  
- API service layer is in `src/services/` directory
- Authentication is handled through JWT tokens
- Private routes protect authenticated pages

## Coding Standards
- Use functional components with hooks
- Implement proper error handling for API requests
- Use descriptive component and variable names
- Keep components focused and reusable
- Follow React best practices for state management
