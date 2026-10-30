/**
 * MCP AI Tools — iAprende
 * AI-powered actions exposed as MCP tools
 */
import type { Tool } from '@modelcontextprotocol/sdk/types.js'
import { autoGradeRespuesta } from '../../ai/autoGrade.js'
import { detectKnowledgeGaps } from '../../ai/knowledgeGaps.js'
import { queryClassData } from '../../ai/analyticsQuery.js'
import { generateCourseFromTopic } from '../../ai/courseGenerator.js'

export const AI_TOOLS: Tool[] = [
  {
    name: 'auto_grade_open_answer',
    description: 'Grade an open-ended quiz response using Claude AI. Returns score (0-100), feedback for the student, and confidence level.',
    inputSchema: {
      type: 'object',
      properties: {
        respuesta_id: { type: 'string', description: 'Firestore respuesta document ID' },
        rubric: { type: 'string', description: 'Optional grading rubric from the instructor' },
      },
      required: ['respuesta_id'],
    },
  },
  {
    name: 'generate_knowledge_gap_report',
    description: 'Analyze a student\'s full response history and identify knowledge gaps. Writes results to alumno_analytics collection.',
    inputSchema: {
      type: 'object',
      properties: {
        alumno_id: { type: 'string', description: 'Firestore user ID of the student' },
      },
      required: ['alumno_id'],
    },
  },
  {
    name: 'answer_instructor_query',
    description: 'Answer a natural language question about class performance. Example: "¿Quién tuvo el promedio más bajo esta semana?"',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Natural language question from the instructor' },
        maestro_id: { type: 'string', description: 'Firestore user ID of the instructor' },
      },
      required: ['query', 'maestro_id'],
    },
  },
  {
    name: 'generate_course_from_topic',
    description: 'Generate a complete course structure (title, description, content blocks, quiz) from a topic description. Creates in Firestore as draft.',
    inputSchema: {
      type: 'object',
      properties: {
        topic: { type: 'string', description: 'Course topic description in natural language' },
        industry_context: { type: 'string', description: 'Industrial context (e.g., "planta manufacturera de autopartes")' },
        maestro_id: { type: 'string', description: 'Instructor user ID who will own the course' },
        num_bloques: { type: 'number', description: 'Number of content blocks to generate (default: 4)' },
      },
      required: ['topic', 'industry_context', 'maestro_id'],
    },
  },
]

export async function handleAiTool(
  name: string,
  args: Record<string, unknown>
): Promise<string> {
  switch (name) {
    case 'auto_grade_open_answer': {
      const { respuesta_id, rubric } = args as { respuesta_id: string; rubric?: string }
      const result = await autoGradeRespuesta(respuesta_id, rubric)
      return JSON.stringify(result, null, 2)
    }

    case 'generate_knowledge_gap_report': {
      const { alumno_id } = args as { alumno_id: string }
      const report = await detectKnowledgeGaps(alumno_id)
      return JSON.stringify(report, null, 2)
    }

    case 'answer_instructor_query': {
      const { query, maestro_id } = args as { query: string; maestro_id: string }
      const result = await queryClassData(query, maestro_id)
      return result.answer
    }

    case 'generate_course_from_topic': {
      const { topic, industry_context, maestro_id, num_bloques } = args as {
        topic: string
        industry_context: string
        maestro_id: string
        num_bloques?: number
      }
      const result = await generateCourseFromTopic(topic, industry_context, maestro_id, num_bloques ?? 4)
      return JSON.stringify(result, null, 2)
    }

    default:
      throw new Error(`Unknown AI tool: ${name}`)
  }
}
