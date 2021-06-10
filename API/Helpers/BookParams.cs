namespace API.Helpers
{
    public class BookParams : PaginationParams
    {
        public string SearchString { get; set; }
		public bool RentedByMe { get; set; }
		public int? Id { get; set; }
    }
}