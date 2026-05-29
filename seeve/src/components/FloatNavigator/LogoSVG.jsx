function LogoSVG() {
    return (
        <div id="logo">
            <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
            >
                <defs>
                    {/* 섀도우 필터 정의 */}
                    <filter id="glow">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="1">
                            <animate attributeName="stdDeviation"
                                values="1;3;1"
                                dur="3s"
                                repeatCount="indefinite" />
                        </feGaussianBlur>
                    </filter>
                </defs>

                {/* 우물 원형 */}
                <circle
                    cx="16"
                    cy="16"
                    r="14"
                    stroke="currentColor"
                    strokeWidth="2"
                />

                {/* 작은 별, 중앙 가까이 + 섀도우 */}
                <g transform="rotate(-15 16 16)" filter="url(#glow)">
                    <path
                        d="
                        M16 11
                        L17 13
                        L19 13
                        L17.5 14.5
                        L18 17
                        L16 15.5
                        L14 17
                        L14.5 14.5
                        L13 13
                        L15 13
                        Z"
                        fill="currentColor"
                    />
                </g>

                {/* 도넛 슬라이스: 반듯하게 */}
                <path
                    d="
                    M8 20
                    A14 14 0 0 0 24 20
                    L24 22
                    A10 10 0 0 1 8 22
                    Z"
                    fill="rgba(0, 0, 29, 0.73)"
                />

                {/* 안쪽 호 */}
                <path
                    d="M8 20 Q16 26 24 20"
                    stroke="rgba(255, 255, 255, 0.73)"
                    strokeWidth="2"
                    strokeLinecap="round"
                >
                    <animate attributeName="stroke-width"
                        values="1;3;1"
                        dur="2s"
                        repeatCount="indefinite" />
                </path>
            </svg>

            {/* <span>seeve</span> */}
        </div>
    );
}

export default LogoSVG;
