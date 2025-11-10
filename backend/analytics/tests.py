from unittest import mock

from django.test import TestCase, override_settings

from analytics import posthog


class PosthogAnalyticsTests(TestCase):
    def tearDown(self):
        posthog._client = None  # reset cached client

    @override_settings(POSTHOG_API_KEY="", POSTHOG_HOST="https://app.posthog.com")
    def test_capture_noop_when_disabled(self):
        with mock.patch("analytics.posthog.Posthog") as mock_client_cls:
            posthog.capture("event", distinct_id="user")
            mock_client_cls.assert_not_called()

    @override_settings(POSTHOG_API_KEY="key", POSTHOG_HOST="https://app.posthog.com")
    def test_capture_invokes_posthog(self):
        with mock.patch("analytics.posthog.Posthog") as mock_client_cls:
            mock_client = mock_client_cls.return_value
            posthog.capture("event", distinct_id="user", properties={"foo": "bar"})
            mock_client.capture.assert_called_once_with(
                distinct_id="user",
                event="event",
                properties={"foo": "bar"},
            )

    @override_settings(POSTHOG_API_KEY="key", POSTHOG_HOST="https://app.posthog.com")
    def test_identify_invokes_posthog(self):
        with mock.patch("analytics.posthog.Posthog") as mock_client_cls:
            mock_client = mock_client_cls.return_value
            posthog.identify("user", properties={"plan": "elite"})
            mock_client.identify.assert_called_once_with(
                distinct_id="user",
                properties={"plan": "elite"},
            )

