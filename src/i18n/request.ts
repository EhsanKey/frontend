import { getRequestConfig } from 'next-intl/server';
import auth from '../../messages/fa/auth.json';
import common from '../../messages/fa/common.json';
import courses from '../../messages/fa/courses.json';
import dashboard from '../../messages/fa/dashboard.json';
import errors from '../../messages/fa/errors.json';
import inquiries from '../../messages/fa/inquiries.json';
import items from '../../messages/fa/items.json';
import mainLayout from '../../messages/fa/mainLayout.json';
import professors from '../../messages/fa/professors.json';
import resources from '../../messages/fa/resources.json';
import reviews from '../../messages/fa/reviews.json';
import telegram from '../../messages/fa/telegram.json';
import users from '../../messages/fa/users.json';
import aiModels from '../../messages/fa/aiModels.json';
import cache from '../../messages/fa/cache.json';
import universities from '../../messages/fa/universities.json';
import campuses from '../../messages/fa/campuses.json';
import majors from '../../messages/fa/majors.json';
import teachings from '../../messages/fa/teachings.json';
import auditLogs from '../../messages/fa/auditLogs.json';
import broadcasts from '../../messages/fa/broadcasts.json';
import permissions from '../../messages/fa/permissions.json';
import botFlow from '../../messages/fa/botFlow.json';
import registeredReviews from '../../messages/fa/registeredReviews.json';
import crawler from '../../messages/fa/crawler.json';

export default getRequestConfig(async () => {
  return {
    locale: 'fa',
    messages: {
      mainLayout,
      common,
      auth,
      dashboard,
      items,
      users,
      reviews,
      registeredReviews,
      crawler,
      resources,
      professors,
      courses,
      universities,
      campuses,
      majors,
      teachings,
      auditLogs,
      broadcasts,
      inquiries,
      errors,
      telegram,
      aiModels,
      cache,
      permissions,
      botFlow,
    },
  };
});
