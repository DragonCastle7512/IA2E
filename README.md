# IA2E

API 키를 등록해 다양한 AI 모델을 사용할 수 있는 웹 기반 채팅 프로젝트입니다.

## 주의 사항
만일의 상황을 대비해 과금이 되지 않는 무료 API 키만 등록하는 것을 추천드립니다.

## 주요 기능
1. API 키 등록 및 관리: Gemini, Mistral 키 입력/저장, 마스킹 표시, 암호화 저장
2. AI 모델 선택: Gemini 또는 Mistral 선택 및 세부 모델 변경
3. 맞춤형 AI 설정: 개인 지시문(Instruction) 저장/적용
4. 채팅 기능: 스트리밍 응답, 대화 기록 저장, 최근 대화 목록
5. 테마/색상 설정: 라이트/다크 및 채팅 컬러 변경
6. 인증/보안: 이메일 회원가입·로그인, 구글 OAuth 로그인, JWT 기반 인증/리프레시, 로그인 레이트 리밋
7. 이메일 인증: 회원가입 전 이메일 인증 메일 발송 및 확인

## API 엔드포인트
인증이 필요한 API는 `access_token` 쿠키(JWT)가 필요합니다. 공개 API는 별도 표기했습니다.

| Method | Path | 설명 | 비고 |
|---|---|---|---|
| POST | `/api/login` | 로그인 | 공개 |
| DELETE | `/api/logout` | 로그아웃 | 인증 필요 |
| POST | `/api/signup` | 회원가입 | 공개 |
| GET | `/api/login/info` | 로그인 사용자 정보 | 인증 필요 |
| POST | `/api/auth/refresh` | 토큰 재발급 | 공개 |
| GET | `/api/auth/google` | 구글 OAuth 시작 | 공개 |
| GET | `/api/auth/google/callback` | 구글 OAuth 콜백 | 공개 |
| GET | `/api/mail/send?email=` | 인증 메일 발송 | 공개 |
| GET | `/api/mail/verify/:token` | 이메일 인증 처리 | 공개 |
| GET | `/api/mail/exist?email=` | 이메일 인증 여부 조회 | 공개 |
| GET | `/api/setting` | 사용자 설정 조회 | 인증 필요 |
| PUT | `/api/setting/personal_ai` | 맞춤형 AI 지시문 저장 | 인증 필요 |
| PUT | `/api/setting/appearance` | 테마/컬러 저장 | 인증 필요 |
| PUT | `/api/setting/model` | 모델 선택/세부 모델 저장 | 인증 필요 |
| GET | `/api/keys` | 등록된 API 키 조회(마스킹) | 인증 필요 |
| PUT | `/api/keys` | API 키 등록/갱신 | 인증 필요 |
| GET | `/api/chats` | 최근 대화 목록 | 인증 필요 |
| POST | `/api/chat/save` | 대화 생성 | 인증 필요 |
| GET | `/api/messages?id=` | 대화 메시지 조회 | 인증 필요 |
| POST | `/api/message/save` | 메시지 저장 | 인증 필요 |
| POST | `/api/fetch` | AI 응답 스트리밍 | 인증 필요 |
| GET | `/api/test` | 헬스 체크 | 공개 |

## 환경 변수 (.env)
각 값은 예시이며 운영 환경에서는 보안값으로 교체하세요. `CRYPTO_SECRET_KEY`는 복호화에 사용되므로 기존 값 변경 시 저장된 API 키 복호화가 불가합니다.

| 키 | 설명 | 예시 |
|---|---|---|
| `DATABASE_URL` | PostgreSQL 접속 문자열 | `postgres://user:pass@localhost:5432/ia2e` |
| `CA_CERTIFICATE` | DB 연결 시 CA 인증서(필요 시) | `C:\\certs\\ca.pem` |
| `JWT_SECRET` | Access 토큰 서명 키 | `long-random-string` |
| `REFRESH_SECRET` | Refresh 토큰 서명 키 | `long-random-string` |
| `GOOGLE_OAUTH_CLIENT` | Google OAuth Client ID | `xxxx.apps.googleusercontent.com` |
| `GOOGLE_OAUTH_SECRET` | Google OAuth Client Secret | `xxxx` |
| `GMAIL_USER` | 인증 메일 발송용 Gmail 계정 | `your@gmail.com` |
| `GMAIL_PASSWORD` | Gmail 앱 비밀번호 | `app-password` |
| `BASE_URL` | 서비스 기본 URL | `http://localhost:3000` |
| `CRYPTO_SECRET_KEY` | API 키 암호화/복호화 키 | `32+ chars secret` |
