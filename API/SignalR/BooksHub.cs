using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
	[Authorize]
	public class BooksHub : Hub
	{
		private const string ManagersGroup = "ManagersGroup";
		public BooksHub() { }

		public override async Task OnConnectedAsync()
		{
			if (Context.User.IsInRole("Manager")) await Groups.AddToGroupAsync(Context.ConnectionId, ManagersGroup);
		}

		public override async Task OnDisconnectedAsync(Exception exception)
		{
			if (Context.User.IsInRole("Manager")) await Groups.RemoveFromGroupAsync(Context.ConnectionId, ManagersGroup);
			await base.OnDisconnectedAsync(exception);
		}

		public async Task SendNotification(Notification notification)
		{
			if (!Context.User.IsInRole("Manager")) await Clients.Group(ManagersGroup).SendAsync("ReceiveNotification", notification);
		}


	}
}