# marcha

세상 모든 자동차

## 개발 환경 및 실행

Next.js 13, React 18, TypeScript, Tailwind CSS를 사용합니다. 의존성에는 Firebase와 TanStack Query가 포함되어 있습니다.

```bash
pnpm install
pnpm dev
```

- `pnpm build`: 프로덕션 빌드
- `pnpm start`: 빌드 결과 실행
- `pnpm lint`: 린트 검사
- `pnpm format`: 코드 포맷 변경

`pages/`는 페이지, `ui/common/`은 공통 UI, `lib/`는 공통 로직을 담습니다. 외부 서비스 기능을 실행하기 전에 해당 설정을 확인하세요.
