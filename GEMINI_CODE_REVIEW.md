# Gemini Code Review: ReturnShield

## Overview
**Project:** ReturnShield
**Date:** 2026-01-19
**Reviewer:** Gemini Codebase Investigator

## 1. Security Analysis
*   **Password File:** `vpspass.txt` was found in the root. (Note: It has now been gitignored, but should ideally be removed from the server).
*   **SQLite Default:** `settings.py` defaults to SQLite if Postgres config is missing. This risks data loss if prod config fails silently.

## 2. Code Quality
*   **Duplicate Field:** `backend/returns/models.py` has a duplicate definition for `refund_amount`.
    *   *Risk:* Low (Python might ignore one), but sloppy.
    *   *Recommendation:* Remove duplicate.

## 3. Critical Findings Checklist
- [x] FIXED: Removed duplicate `refund_amount` in `models.py`.
- [ ] Force Postgres in production (raise error if DB config missing).
- [ ] Verify Shopify OAuth state token validation.
