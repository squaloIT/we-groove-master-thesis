/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkapp"] = self["webpackChunkapp"] || []).push([["src_js_notifications_js"],{

/***/ "./src/js/notifications.js":
/*!*********************************!*\
  !*** ./src/js/notifications.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ notifications)\n/* harmony export */ });\n/* harmony import */ var _utils_listeners__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/listeners */ \"./src/js/utils/listeners.js\");\n\nfunction notifications() {\n  Array.from(document.querySelectorAll('#notifications > div.content-wrapper > a.notification-link')).forEach(function (el) {\n    el.addEventListener('click', _utils_listeners__WEBPACK_IMPORTED_MODULE_0__.onClickOnNotification);\n  });\n  document.querySelector(\"div.right_column #topics-users-search\").addEventListener(\"keyup\", (0,_utils_listeners__WEBPACK_IMPORTED_MODULE_0__.onSearchTopicsAndUsers)());\n  document.querySelector(\"div.online-users-container div.online-users-header button.open-online-users\").addEventListener(\"click\", function (e) {\n    return (0,_utils_listeners__WEBPACK_IMPORTED_MODULE_0__.onClickToggleOnlineUsersWrapper)(e);\n  });\n  document.querySelector(\"div.online-users-container div.online-users-header button.close-online-users\").addEventListener(\"click\", function (e) {\n    return (0,_utils_listeners__WEBPACK_IMPORTED_MODULE_0__.onClickToggleOnlineUsersWrapper)(e);\n  });\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvanMvbm90aWZpY2F0aW9ucy5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovL2FwcC8uL3NyYy9qcy9ub3RpZmljYXRpb25zLmpzPzI2NzAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgb25DbGlja09uTm90aWZpY2F0aW9uLCBvbkNsaWNrVG9nZ2xlT25saW5lVXNlcnNXcmFwcGVyLCBvblNlYXJjaFRvcGljc0FuZFVzZXJzIH0gZnJvbSBcIi4vdXRpbHMvbGlzdGVuZXJzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBub3RpZmljYXRpb25zKCkge1xuICBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNub3RpZmljYXRpb25zID4gZGl2LmNvbnRlbnQtd3JhcHBlciA+IGEubm90aWZpY2F0aW9uLWxpbmsnKSkuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uQ2xpY2tPbk5vdGlmaWNhdGlvbik7XG4gIH0pO1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2LnJpZ2h0X2NvbHVtbiAjdG9waWNzLXVzZXJzLXNlYXJjaFwiKS5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgb25TZWFyY2hUb3BpY3NBbmRVc2VycygpKTtcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImRpdi5vbmxpbmUtdXNlcnMtY29udGFpbmVyIGRpdi5vbmxpbmUtdXNlcnMtaGVhZGVyIGJ1dHRvbi5vcGVuLW9ubGluZS11c2Vyc1wiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGUpIHtcbiAgICByZXR1cm4gb25DbGlja1RvZ2dsZU9ubGluZVVzZXJzV3JhcHBlcihlKTtcbiAgfSk7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXYub25saW5lLXVzZXJzLWNvbnRhaW5lciBkaXYub25saW5lLXVzZXJzLWhlYWRlciBidXR0b24uY2xvc2Utb25saW5lLXVzZXJzXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZSkge1xuICAgIHJldHVybiBvbkNsaWNrVG9nZ2xlT25saW5lVXNlcnNXcmFwcGVyKGUpO1xuICB9KTtcbn0iXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/js/notifications.js\n");

/***/ })

}]);