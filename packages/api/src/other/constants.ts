import type { SurveyQuestion } from '@pkg/db';

export const questions: Partial<Record<SurveyQuestion, { label: string }>> = {
  // These have been (potentially) via the web form
  BUILDING_WHAT: {
    label: 'What have you been building with AI technologies?',
  },
  WANT_TO_LEARN: {
    label: 'What are you most interested in learning?',
  },
  // WANT_TO_HEAR: {
  //   label:
  //     'Who are some people you’d like to meet or hear speak at Summit or other events?',
  // },

  // These have been answered when purchasing a ticket via Tito
  // Q_1162127: {
  //   label: 'How would you best-classify your job role?',
  // },
  // Q_1162128: {
  //   label: 'How would you classify your experience level?',
  // },
  // Q_1162130: {
  //   label: 'In which city are you based?',
  // },
  // Q_1162129: {
  //   label: 'In which country are you based?',
  // },
  // Q_1162134: {
  //   label: 'Job title',
  // },
  // Q_1162133: {
  //   label: 'What are your current favorite tech tools?',
  // },
  // Q_1162132: {
  //   label: "What is one thing you're seeking to learn?",
  // },

  // These have not yet been answered by attendees prior to the event
  TECHNOLOGIES: {
    label: 'What technologies are you most interested in?',
  },
  ASK_PROBLEM_SOLVE: {
    label:
      'What ask would you have for another attendee, or what problem could they help you solve?',
  },
  GIVE_PROVIDE_OTHERS: {
    label: 'In what way could you potentially help another attendee?',
  },
};
