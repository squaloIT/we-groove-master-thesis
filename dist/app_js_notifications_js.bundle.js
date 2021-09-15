"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkwegroove"] = self["webpackChunkwegroove"] || []).push([["app_js_notifications_js"],{

/***/ "./app/js/notifications.js":
/*!*********************************!*\
  !*** ./app/js/notifications.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ notifications)\n/* harmony export */ });\n/* harmony import */ var _utils_listeners__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/listeners */ \"./app/js/utils/listeners.js\");\n\nfunction notifications() {\n  Array.from(document.querySelectorAll('#notifications > div.content-wrapper > a.notification-link')).forEach(function (el) {\n    el.addEventListener('click', _utils_listeners__WEBPACK_IMPORTED_MODULE_0__.onClickOnNotification);\n  });\n  document.querySelector(\"div.right_column #topics-users-search\").addEventListener(\"keyup\", (0,_utils_listeners__WEBPACK_IMPORTED_MODULE_0__.onSearchTopicsAndUsers)());\n  document.querySelector(\"div.online-users-container div.online-users-header button.open-online-users\").addEventListener(\"click\", function (e) {\n    return (0,_utils_listeners__WEBPACK_IMPORTED_MODULE_0__.onClickToggleOnlineUsersWrapper)(e);\n  });\n  document.querySelector(\"div.online-users-container div.online-users-header button.close-online-users\").addEventListener(\"click\", function (e) {\n    return (0,_utils_listeners__WEBPACK_IMPORTED_MODULE_0__.onClickToggleOnlineUsersWrapper)(e);\n  });\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9hcHAvanMvbm90aWZpY2F0aW9ucy5qcy5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd2Vncm9vdmUvLi9hcHAvanMvbm90aWZpY2F0aW9ucy5qcz9hYzc3Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IG9uQ2xpY2tPbk5vdGlmaWNhdGlvbiwgb25DbGlja1RvZ2dsZU9ubGluZVVzZXJzV3JhcHBlciwgb25TZWFyY2hUb3BpY3NBbmRVc2VycyB9IGZyb20gXCIuL3V0aWxzL2xpc3RlbmVyc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbm90aWZpY2F0aW9ucygpIHtcbiAgQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcjbm90aWZpY2F0aW9ucyA+IGRpdi5jb250ZW50LXdyYXBwZXIgPiBhLm5vdGlmaWNhdGlvbi1saW5rJykpLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbkNsaWNrT25Ob3RpZmljYXRpb24pO1xuICB9KTtcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImRpdi5yaWdodF9jb2x1bW4gI3RvcGljcy11c2Vycy1zZWFyY2hcIikuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIG9uU2VhcmNoVG9waWNzQW5kVXNlcnMoKSk7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXYub25saW5lLXVzZXJzLWNvbnRhaW5lciBkaXYub25saW5lLXVzZXJzLWhlYWRlciBidXR0b24ub3Blbi1vbmxpbmUtdXNlcnNcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChlKSB7XG4gICAgcmV0dXJuIG9uQ2xpY2tUb2dnbGVPbmxpbmVVc2Vyc1dyYXBwZXIoZSk7XG4gIH0pO1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2Lm9ubGluZS11c2Vycy1jb250YWluZXIgZGl2Lm9ubGluZS11c2Vycy1oZWFkZXIgYnV0dG9uLmNsb3NlLW9ubGluZS11c2Vyc1wiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGUpIHtcbiAgICByZXR1cm4gb25DbGlja1RvZ2dsZU9ubGluZVVzZXJzV3JhcHBlcihlKTtcbiAgfSk7XG59Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./app/js/notifications.js\n");

/***/ })

}]);