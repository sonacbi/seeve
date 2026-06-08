export const getRelativeTime =
    (updatedAt) => {

    if (!updatedAt)
        return "저장 안 됨";

    const diff =
        Date.now() -
        new Date(
            updatedAt
        ).getTime();

    const sec =
        Math.floor(diff / 1000);

    const min =
        Math.floor(sec / 60);

    const hour =
        Math.floor(min / 60);

    const day =
        Math.floor(hour / 24);

    if (sec < 60)
        return "방금 저장";

    if (min < 60)
        return `${min}분 전 저장`;

    if (hour < 24)
        return `${hour}시간 전 저장`;

    return `${day}일 전 저장`;
};