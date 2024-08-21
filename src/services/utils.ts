function formatDate(dateString: string): string {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    const formattedDate = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    return formattedDate;
}

export { formatDate };